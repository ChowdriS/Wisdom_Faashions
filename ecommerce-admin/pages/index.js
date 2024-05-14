import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


import React from 'react';

const ProductCard = ({ product }) => (
    <div className="w-64 h-80 rounded overflow-hidden shadow-lg mt-4 mx-2">
        <img className=" object-contain w-full h-1/3 mt-4" src={product.images[0]} alt={product.title} />
        <div className="px-6 py-2">
            <div className="font-bold text-xl mb-2 text-center">{product.title}</div>
            <p className="text-gray-700 text-base">{product.description}</p>
            <p className="text-gray-900 text-xl mt-2">Rs.{product.price}</p>
        </div>
    </div>
);


export default function Home({featuredProduct,newProducts}) {
  // console.log(newProducts)
  const {data: session} = useSession();
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
    <div className="mt-16 flex flex-wrap">
    {newProducts.map(product => (
            <ProductCard key={product._id} product={product} />
        ))}
    </div>
  </Layout>
}


export async function getServerSideProps() {
  const featuredProductId = '66405ad0edc9ecf8586f0987';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  // console.log(newProducts);
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
