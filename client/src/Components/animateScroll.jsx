import React, { useEffect, useRef } from "react";
// import { useInView } from "react-intersection-observer";
import "./animateScroll.css";
import { motion, useAnimation } from "framer-motion";
// import { useInView } from "framer-motion/dist/esm/use-in-view";
import { useInView } from "react-intersection-observer";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shadowAnimation = keyframes`
  0% {
    text-shadow: none;
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: none;
  }
`;

const colorAnimation = keyframes`
  0% {
    color: #fff3d1;
  }
  50% {
    color: #9bfc62;
  }
  100% {
    color: #fae9b9;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 200px;
  //   max-width: 700px;
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  width: 48%;
  &:hover {
    background: linear-gradient(135deg, #b06ab3, #4568dc);
  }
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "Consolas", sans-serif;
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

const CardText = styled.p`
  margin-bottom: 0.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ffffff;
  font-weight: bold;
  color: #ffffff;
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

const AnimatedElement = () => {
  //   const [ref, inView] = useInView({
  //     threshold: 0.5,
  //   });

  const {
    ref: animaniaRef,
    inView: inViewAnimania,
    animaniaEntry,
  } = useInView();

  const { ref: ref1, inView: inView1, entry1 } = useInView();
  const { ref: ref2, inView: inView2, entry2 } = useInView();
  const { ref: ref3, inView: inView3, entry3 } = useInView();

  const { ref: logo1Ref, inView: logo1InView, logo1Entry } = useInView();
  const { ref: logo2Ref, inView: logo2InView, logo2Entry } = useInView();
  const { ref: logo3Ref, inView: logo3InView, logo3Entry } = useInView();
  const { ref: logo4Ref, inView: logo4InView, logo4Entry } = useInView();
  const { ref: logo5Ref, inView: logo5InView, logo5Entry } = useInView();

  const animaniaLogo = "/images/AniMania.png";

  //   const ref = useRef(null);
  //   const inView = useInView(ref, { once: true });

  const mainControls = useAnimation();

  const sectionVariantsRightToLeft = {
    hidden: { x: "100%", filter: "blur(10px)" },
    visible: { x: 0, filter: "blur(0px)" },
  };

  const sectionVariantsLeftToRight = {
    hidden: { x: "-100%", filter: "blur(10px)" },
    visible: { x: 0, filter: "blur(0px)" },
  };

  //   const ref1 = useRef();
  //   const ref2 = useRef();
  //   const ref3 = useRef();

  //   const [inView1, refInView1] = useInView({
  //     threshold: 0.5,
  //   });

  //   const [inView2, refInView2] = useInView({
  //     threshold: 0.5,
  //   });

  //   const [inView3, refInView3] = useInView({
  //     threshold: 0.5,
  //   });

  useEffect(() => {
    console.log("inView1:", inView1);
  }, [inView1]);

  useEffect(() => {
    console.log("inView2:", inView2);
  }, [inView2]);

  useEffect(() => {
    console.log("inView3:", inView3);
  }, [inView3]);
  //   useEffect(() => {
  //     console.log("inView:", inView);
  //     if (inView) {
  //       mainControls.start({
  //         opacity: 1,
  //         transition: { duration: 0.5 },
  //       });
  //     }
  //   }, [inView]);

  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add("animate-home-page");
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove("animate-home-page");
    };
  }, []);

  return (
    <motion.div>
      <div>
        <motion.div
          style={{ minHeight: "30vh" }}
          ref={animaniaRef}
          initial={{ opacity: 0 }}
          animate={inViewAnimania ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={animaniaLogo} alt="AniMania Logo" className="" />
        </motion.div>
        <motion.div
          ref={ref1}
          className="animate-section"
          initial="hidden"
          animate={inView1 ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          variants={sectionVariantsLeftToRight}
        >
          {/* <section>
            <h1>Test</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Asperiores corporis a error quam facilis optio corrupti odit rem,
              minima vel consequuntur similique eos? Eveniet fuga laudantium
              consequatur tempore rem doloremque.
            </p>
          </section> */}
          <CardContainer>
            <Card
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              }}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardTitle>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                necessitatibus a nemo numquam eaque, aut corporis aliquid, culpa
                minima iure neque iusto accusantium sequi delectus cum nihil
                assumenda obcaecati! Harum.
              </CardTitle>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.{" "}
              </CardText>
              <CardFooter>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.
              </CardFooter>
            </Card>
          </CardContainer>
        </motion.div>
        <motion.div
          ref={ref2}
          className="animate-section"
          initial="hidden"
          animate={inView2 ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          variants={sectionVariantsRightToLeft}
        >
          <CardContainer
            style={{
              justifyContent: "flex-start",
            }}
          >
            <Card
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              }}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardTitle>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                necessitatibus a nemo numquam eaque, aut corporis aliquid, culpa
                minima iure neque iusto accusantium sequi delectus cum nihil
                assumenda obcaecati! Harum.
              </CardTitle>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.{" "}
              </CardText>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.
              </CardText>
            </Card>
          </CardContainer>
        </motion.div>
        <div className="logos" style={{ height: "50vh" }}>
          <motion.div
            ref={logo1Ref}
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={
              logo1InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 1 }}
          >
            Logo 1
          </motion.div>
          <motion.div
            ref={logo2Ref}
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={
              logo2InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 1, delay: 0.2 }}
          >
            Logo 2
          </motion.div>
          <motion.div
            ref={logo3Ref}
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={
              logo3InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 1, delay: 0.4 }}
          >
            Logo 3
          </motion.div>
          <motion.div
            ref={logo4Ref}
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={
              logo4InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 1, delay: 0.6 }}
          >
            Logo 4
          </motion.div>
          <motion.div
            ref={logo5Ref}
            className="logo"
            initial={{ opacity: 0, x: -50 }}
            animate={
              logo5InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 1, delay: 0.8 }}
          >
            Logo 5
          </motion.div>
        </div>
        <motion.div
          ref={ref3}
          className="animate-section"
          animate={inView3 ? "visible" : "hidden"}
          transition={{ duration: 1 }}
          variants={sectionVariantsLeftToRight}
        >
          <CardContainer>
            <Card
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              }}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardTitle>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                necessitatibus a nemo numquam eaque, aut corporis aliquid, culpa
                minima iure neque iusto accusantium sequi delectus cum nihil
                assumenda obcaecati! Harum.
              </CardTitle>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.{" "}
              </CardText>
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                incidunt neque distinctio ad vel dignissimos provident eaque
                repudiandae reprehenderit hic sed excepturi et, impedit expedita
                quis mollitia vitae cum dolor.
              </CardText>
            </Card>
          </CardContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedElement;
