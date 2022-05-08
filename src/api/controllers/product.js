const Product  =  require('../models/Product')

exports.create = async(req,res) =>{
try {
   


    //create new product
    const newProduct = await new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.description,
        price: req.body.price,
    }).save()
   // console.log(newProduct)

    //return created Product
    res.status(200).json(newProduct)
} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}

exports.list = async(req,res) => {
try {
   const allProducts = await Product.find({}).sort([['price']]).exec()

   res.status(200).json(allProducts)
} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}

exports.update = async(req,res)=>{
try {
     //check if product exist in database
     const product = await Product.findById(req.body.id).exec()
   
     //if product do not exist return "product not found"
     if(!product) return res.status(404).json("product not found")

     const updatedProduct = await Product.findByIdAndUpdate(req.body.id, req.body, {new:true}).exec()

     res.status(200).json(updatedProduct)

} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}

exports.read = async(req,res)=>{
try {

   // console.log("working",req.params.id)
    const product  = await Product.findOne({_id: req.params.id}).exec()
    //console.log("product",product)

    res.status(200).json(product)
} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}

exports.remove = async(req,res) => {
try {

    //delete product using id
    const deleted = await Product.findByIdAndRemove(req.params.id).exec()

    res.status(200).json(deleted)
} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}

//for searching

//search by name
exports.nameSearch = async(req,res) => {
    try {
        let productName = req.params.productName
        
        const products = await Product.find( {$search: productName}).exec()

        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

//search by category
exports.categorySearch = async(req, res) => {
    try {
        let category = req.params.categoryName
        const products = await Product.find({category: category}).exec()

        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}