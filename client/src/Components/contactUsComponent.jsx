// import React, { useEffect } from "react";
// import "./contactUsComponent.css";

// export default function ContactUsComponent() {
//   useEffect(() => {
//     // Add class to body when component mounts
//     document.body.classList.add("contact-us-page");
//     return () => {
//       // Remove class from body when component unmounts
//       document.body.classList.remove("contact-us-page");
//     };
//   }, []);
//   return (
//     <div className="contact-us-container">
//       <div class="divider">
//         <h1>Nawriz Ahmed Turjo</h1>
//       </div>
//       <div className="wrapper">
//         <form className="contact-container">
//           <h1>Contact Us</h1>
//           <div className="contact-input input-name">
//             <div className="input-box">
//               <input
//                 type="text"
//                 className="first-name"
//                 name="fName"
//                 placeholder="First Name"
//               />
//               <i className="bx bxs-user"></i>
//             </div>
//             <div className="input-box">
//               <input
//                 type="text"
//                 className="last-name"
//                 name="lName"
//                 placeholder="Last Name"
//               />
//               <i className="bx bxs-user"></i>
//             </div>
//           </div>
//           <div className="input-box">
//             <div className="contact-input input-email">
//               <input
//                 type="email"
//                 className="email"
//                 name="email"
//                 placeholder="Email"
//               />
//             </div>
//             <i className="bx bxs-envelope"></i>
//           </div>
//           <div className="input-box">
//             <div className="contact-input input-subject">
//               <input
//                 type="text"
//                 className="subject"
//                 name="subject"
//                 placeholder="Subject"
//               />
//             </div>
//             <div className="input-box">
//               <i className="bx bxs-envelope"></i>
//             </div>
//             <div className="contact-input input-message">
//               <input
//                 type="text"
//                 className="message"
//                 name="message"
//                 placeholder="Message"
//               />
//             </div>
//             <i className="bx bxs-envelope"></i>
//           </div>
//           <div className="action-btn">
//             <button className="btn btn-submit">Submit</button>
//           </div>
//           <div className="or-text">Or contact us on social media</div>
//           <div className="social-contact">
//             <div className="social">
//               <div className="handle">@online_shop</div>
//               <div className="social-action">
//                 <span>Instagram</span>
//                 <span className="material-symbols-rounded">
//                   arrow_right_alt
//                 </span>
//               </div>
//             </div>
//             <div className="social">
//               <div className="handle">@online_shop</div>
//               <div className="social-action">
//                 <span>Twitter</span>
//                 <span className="material-symbols-rounded">
//                   arrow_right_alt
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//       <div class="divider">
//         <h1>Shams Hossain Simanto</h1>
//       </div>
//     </div>
//   );
// }
