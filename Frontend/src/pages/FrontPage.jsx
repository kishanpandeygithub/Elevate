import Hero from "../component/Hero";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
const FrontPage = ()=>{
    return (
        <div className="min-h-screen bg-[#070708] text-zinc-100 antialiased font-sans selection:bg-orange-500 selection:text-black">
            <NavBar></NavBar>
            <Hero></Hero>
            <Footer></Footer>
        </div>
    )
}
export default FrontPage;