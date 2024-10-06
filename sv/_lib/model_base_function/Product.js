/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { Product } from "../models/Products.js";
import { Alert, log, Success } from "../utils/smallUtils.js";

export async function findProductPageNavigation(req, res) {
  try {
    let productArray = await Product.find({});
    res.render('shop',{
      Product :productArray
    });
  } catch (e) {
    res.status(500).render('massage_server', {
      title: 'Failed, Try Again',
      body :`We Failed To Find Products  due to Server Problem related To database,  Please Try Again. <br > Thank You `
    })
  } 
};

export const FindProduct =async (req,res) => {
  try {
    let productArray = await Product.find({});
    res.json({
      success:true,
      product :productArray
    })
  } catch (e) {
    res.status(500).json({error :'Failed to Give you the products'})
  } 
}



export async function findProductDetails(req,res) {
  let {id}=req.params;    
  if (Number(id).toString() ==='NaN') return res.render('massage_server', {
    title: 'Can not find the product',
    body: 'there is no such product Matching This Name '
  })
    try {
      let prod = await Product.findOne({
        id:id
      })
      if (!prod)  {
        log('!prod')
        return res.render('massage_server', {
        title: 'Can not find the product',
        body: 'there is no such product Matching This Name '
      });}
      

      if (prod) {
       let {name , description, thumb, images,cetegory, selling_style,id ,price  ,size_and_price}=prod;
          return res.render('Product-detail', {
            name , description, thumb, images,cetegory, selling_style ,id,price,size_and_price,
            metaname : name.length>80 ? name.substring(0,80) : name  ,
            metaDescription:description.length >120? description.substring(0,120):description

          })
      }
      
    } catch (e) {
      console.log(e)
      return res.render('massage_server', {
        title :'Can not find the product',
        body : 'there is no such product Matching This Name '
      });
    }
    
  }
  



  export async function giveProductDetails(req,res) {
    let {id}=req.body;    
    if (!id) return  Alert('data is not define',res);
     
    
    if (Number(id).toString() ==='NaN') { 
      log(`
          if (Number(id).toString() ==='NaN')
        `)
          Alert('There is not product',res);

      return 
    }
      try {
        let prod = await Product.findOne({
          id:id ,
         
        })
        if (!prod)  {
          log('!prod')
        Alert('There is not product',res);
        }
        
  
        if (prod) {
            return res.json({prod});
        }
        
      } catch (e) {
        console.log(e)
        Alert('Server error',res);
      }
      
    }
    


  

  export  async function DeleteProduct(req,res) {
    let {id}= req.body;
    if (!id) return Alert('Please Give The Correct User InfoCan not Bann User ',res );
    if(   Number(id).toString()==='NaN' ) return Alert('This id is not valid')
    Product.findOneAndDelete({id})
    .then(e=>Success(res))
    .catch(e => {
      log(e);
      Alert('Server error')
    })
  };
  
  
  