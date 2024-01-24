import React from 'react';
import { BarLoader,DoubleBubble, SlidingPebbles,DoubleOrbit } from 'react-spinner-animated';

import 'react-spinner-animated/dist/index.css'

export default function Loader() {
    return <DoubleOrbit text={"Loading..."}
    center={true} width={"150px"} height={"150px"}/>
};