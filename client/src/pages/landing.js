import React from "react";
import { CustomLink } from "../navbar";
export default function Landing() {
    return <div>
        <CustomLink to="/sign_up">sign_up</CustomLink>
        <CustomLink to="/login">login</CustomLink>
        </div>
}