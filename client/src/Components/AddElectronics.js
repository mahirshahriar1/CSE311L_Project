import React from 'react'
import Navbar from './Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Axios from 'axios';


export default function AddElectronics() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [specification, setSpec] = useState("");
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
   

    const [imgfile, setImgfile] = useState("");
    const [sellerid, setSellerid] = useState(0);


    axios.defaults.withCredentials = true;

    const setname = (e) => {
        setName(e.target.value);
    }
    const setprice = (e) => {
        setPrice(e.target.value);
    }
    const setspec = (e) => {
        setSpec(e.target.value);
    }
    const settype = (e) => {
        setType(e.target.value);
    }
    const setbrand = (e) => {
        setBrand(e.target.value);
    }

   

    const setimgfile = (e) => {
        // console.log(e.target.files[0])
        setImgfile(e.target.files[0]);
    }

    const addUserDate = async (e) => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("photo", imgfile);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("sellerid", sellerid);
        formData.append("spec", specification);
        formData.append("type", type);
        formData.append("brand", brand);
        // console.log(formData);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const res = await axios.post('http://localhost:3001/addelectronics', formData, config);

        if (res.data.message) {
            alert(res.data.message);
            
            window.location.reload();
        }
        else {
            alert(res.data.err);
        }

    }
    const [bool, setBool] = useState(false);

    useEffect(() => {

        Axios.get('http://localhost:3001/sellerlogin').then((response) => {
            // console.log(response.data.loggedIn);
            if (response.data.loggedIn === true && response.data.user[0].Type === 'Seller') {
                setBool(true);
                setSellerid(response.data.user[0].ID);

            }
        });

    }, []);

    return (
        bool && <>
            <Navbar></Navbar>
            <div style={{ paddingLeft: '50px' }} className="container mt-3">
                <h1 style={{ textAlign: 'center' }}>Add An Electronics</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name='fname' onChange={setname} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name='fname' onChange={setprice} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Specifications</Form.Label>
                        <Form.Control type="text" name='fname' onChange={setspec} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Type</Form.Label>
                        <Form.Control type="text" name='fname' onChange={settype} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type="text" name='fname' onChange={setbrand} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Select your image</Form.Label>
                        <Form.Control type="file" name='photo' onChange={setimgfile} />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={addUserDate}>
                        Submit
                    </Button>
                </Form>
            </div>


        </>
    )
}
