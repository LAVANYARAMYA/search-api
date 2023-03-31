import axios from 'axios';
import React, { useState,useRef,useEffect } from 'react';

import logo from './logo.svg';
import './App.css';
import search from './Search.svg'
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

function App() {
    const myRef = useRef(null);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([]);
    const [title,setTitle]= useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(10);

    useEffect(() => {
        if (myRef.current) {
          NET({

            el: myRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            spacing:15,
            maxDistance:20,
            points:10,
            color: 0x020024,
            backgroundColor: 0xeeeeee,
            THREE: THREE
          });
        }
      }, [myRef]);

    useEffect(() =>
    {
    const title=output.title;
    setTitle(title); }, []);


    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    const response= await axios.get('http://localhost:8080/api/echo' ,{
    params: {
    input: input
     }    }  );
     setOutput(response.data);
     }    catch(error)  {
      console.error(error);    }  }
      const handleInputChange = (event) => {

      setInput(event.target.value);  }

      //console.log(output);
     // const[array1,array2]=output;
     // console.log(array1);
     // console.log(array2);

     const linkArray= [];
     const titleArray=[];
     for (var i = 0; i < output.length; ++i) {
         if ( ( [i] % 2 ) === 0) {
          linkArray.push(output[i]);
         }
         else {
           titleArray.push(output[i]);
         }
       };


       // Get current blogs
             const indexOfLastBlog = currentPage * blogsPerPage;
             const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
             const currentBlogs = linkArray.slice(indexOfFirstBlog, indexOfLastBlog);
             const currentBlogs1 = titleArray.slice(indexOfFirstBlog, indexOfLastBlog);


             // Change page
               const paginate = (pageNumber) => setCurrentPage(pageNumber);

               // Render pagination links
               const pageNumbers = [];
               for (let i = 1; i <= Math.ceil(linkArray.length / blogsPerPage); i++) {
                 pageNumbers.push(i);
               }
               const renderPageNumbers = pageNumbers.map((number) => {
                 return (
                   <p className="Page" key={number}>
                     <button onClick={() => paginate(number)}>{number}</button>
                   </p>
                 );
               });



         return (
         <div className="container" ref={myRef}>

           <div className="App">
            <img src={logo} className="App-logo"  alt="logo" />
           <header className="App-header">

       <form onSubmit={handleSubmit}>

     <div style={{ display: 'flex'}} >
              Keyword:<span></span>
               <div><input className="searchBar input" type="text" value={input} onChange={handleInputChange} /></div>
             <div><button className="searchButton" type="submit" onSubmit={handleSubmit} > <img src={search} className="Search-logo" alt="search"/></button></div>
           </div>
           </form>
           </header>

     <div className="content">
           <ul>
             {currentBlogs.map((link, index) => (
                  <li key={index}>
                          {link === 'Keyword not found' ? (
                                     <p>Keyword not found</p>
                                         ) : (
                                              <a href={encodeURI(currentBlogs[index])} target="_blank">{currentBlogs1[index]}</a>
                                                      )}
                  </li>
             ))}
           </ul>


           <div className="page">
               {renderPageNumbers}
           </div>

     </div>
     </div>
     </div>
       );
     }

export default App;

