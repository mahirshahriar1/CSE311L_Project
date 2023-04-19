const express = require('express');

const seller = new express.Router();
const db = require("../db/conn");
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');

// img storage config
var imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`);
    }
})

// img filter 
const isImage = (req, file, callback) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true);
    } else {
        callback(new Error('Only Image is Allowed'), false);
    }
}

var upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})

seller.post('/importShop', (req, res) => {
    const id = req.body.ID;

    db.query("SELECT * FROM products WHERE SellerID=?", [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {

            res.send(result);
        }
    }
    );

});

//delete product
seller.delete("/dltProduct/:id/:imglink", (req, res) => {

    const id = req.params.id;
    const userimg = req.params.imglink;
    try {
        db.query("DELETE FROM products WHERE id=?", [id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Data Deleted');
                res.status(201).json({ status: 201, data: result })
            }
        })
    }
    catch (error) {
        res.status(422).json({ status: 422, error });
    }

    console.log(userimg);
    fs.unlink(`./uploads/${userimg}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File Deleted');
        }
    })

})

//edit product
seller.put("/editProduct/:id", upload.single("photo"), (req, res) => {
    const { filename } = req.file;
    const { name } = req.body;
    const { price } = req.body;
    console.log(price);
    const{photo}=req.body;
  

    // console.log(sellerid);
    const { size } = req.body;
    const { color } = req.body;
    const { brand } = req.body;
    const { material } = req.body;
    const { type } = req.body;
    const { sellerid } = req.body;
    const { id } = req.body;
    const { oldimage }=req.body;
    const {quantity}=req.body;
    const {description}=req.body;
    const {specification}=req.body;
    const {genre}=req.body;
    const {summary}=req.body;
    const {author}=req.body;

    //products(Image,Price,SellerID, AdminID, Name,Type)  

    db.query("UPDATE products SET Image=?,Price=?,Name=?,Type=?,Quantity=? WHERE id=?", [filename, price, name, type,quantity, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(oldimage)
            res.status(201).json({ status: 201, data: result })
            fs.unlink(`./uploads/${oldimage}`, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File Deleted');
                }
            })
        }
    }
    );

    if(type==='Clothes'){
        db.query("UPDATE clothes SET Size=?,Color=?,Brand=?,Material=? WHERE ProductID=?", [size, color, brand, material, id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Data Updated');
            }
        }
        );
    }else if(type==='Cosmetics'){
        //Type Brand Description
        db.query("Update cosmetics set Type=?,Brand=?,Description=? where ProductID=?",[type,brand,description,id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Data Updated');
            }
        }
        )
    }
    else if(type==='Electronics'){
        //Specification Type Brand
        db.query("Update electronics set Specification=?,Type=?,Brand=? where ProductID=?",[specification,type,brand,id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Data Updated');
            }
        }
        )
    }
    else if(type==='Books'){
        //Genre Summary Author
        db.query("Update books set Genre=?,Summary=?,Author=? where ProductID=?",[genre,summary,author,id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Data Updated');
            }
        }
        )
    }

})




module.exports = seller;
