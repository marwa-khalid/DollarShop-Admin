import React, { useState ,useEffect} from 'react';
import axios from "axios";
import "./Modal.css";
import { TextField } from "@mui/material";
import Modal from "@mui/material/Modal";

const EditProductModal = ({ onClose, productId }) => {
  const [productTitle, setProductTitle] = useState(' '); 
  const [productPrice, setProductPrice] = useState(0); 
  const [productDescription, setProductDescription] = useState(' ');
  const [productImage, setProductImage] = useState(' ');
  const [productQuantity, setProductQuantity] = useState(0);
  const [productCategory, setProductCategory] = useState(' '); 
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://dollar-wala-server.vercel.app/api/products/${productId}`);
      const product = response.data;

      setProductTitle(product.title);
      setProductPrice(product.price);
      setProductDescription(product.description);
      setProductImage(product.image);
      setProductQuantity(product.quantity);
      setProductCategory(product.category);
      
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
   
    await axios.get("https://dollar-wala-server.vercel.app/api/categories")
    .then((response)=>{
      setCategories(response.data);
    })
    .catch((error)=>{
      console.error("Error fetching categories:", error);
    })

  }

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    
      axios.post("https://dollar-wala-server.vercel.app/api/categories", { category: newCategory },
      {
      headers: {
          "Content-Type": "application/json",
        }})
        .then((response)=>{
          fetchCategories();
          setAddCategoryModalOpen(false);
          setNewCategory("");
        })
        .catch((error)=>{
          window.alert("Error adding category:", error);
        })
  };
  
  const handleEditProduct = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', productTitle);
    formData.append('price', productPrice);
    formData.append('description', productDescription);
    formData.append('quantity', productQuantity);
    formData.append('category', productCategory);
  
    if (productImage instanceof File) {
      formData.append('image', productImage);
    }
    const data = {
      title: productTitle,
      price: productPrice,
      description: productDescription,
      image: productImage,
      quantity: productQuantity,
      category: productCategory, 
     
    };

    console.log(data)
    axios.put(`https://dollar-wala-server.vercel.app/api/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      window.alert(response.data.message);

        onClose();
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  return (
    <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <span className="modal-title">Edit Product</span>
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
      </div>
      <div className="modal-body">
        <div className="modal-field">
            <label>Product Title</label>
            <input
              type="text"
              placeholder="Enter product Title"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Product Price</label>
            <input
              type="number"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Product Description</label>
            <input
              type="text"
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Product Image</label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile"
                  onChange={(e) => setProductImage(e.target.files[0])}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile">
                  {productImage ? (
                    <>
                      Selected file:
                      <img
                        src={`https://dollar-wala-server.vercel.app/${productImage}`}
                        alt="Selected Image"
                        style={{ maxWidth: '50px', maxHeight: '50px' }}
                      />
                    </>
                  ) : (
                    'Choose file'
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="modal-field">
            <label>Product Quantity</label>
            <input
              type="number"
              placeholder="Enter product quantity"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Select Category</label>
            <div className="radio-group">
              {/* Render categories dynamically */}
              {categories && categories.map((category) => (
                <label key={category._id} className="radio-label">
                  <input
                    type="radio"
                    value={category.category}
                    checked={productCategory === category.category}
                    onChange={(e) => setProductCategory(e.target.value)}
                  />
                  {category.category} 
                </label>
              ))}

              {/* Input for a new category */}
              <div className="radio-label">
                <button onClick={() => setAddCategoryModalOpen(true)}>Add</button>
              </div>
            <Modal
              open={isAddCategoryModalOpen}
              onClose={() => setAddCategoryModalOpen(false)}
            >
              <div className="modal">
              <div className="modal-content">
                <TextField
                  label="New Category"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
                
                <div className="modal-actions">
                <button className="no"  onClick={() => setAddCategoryModalOpen(false)}>Cancel</button>
                <button className="yes" onClick={handleAddCategory}>Add</button>
                </div>
                </div>
                
                
              </div>
            </Modal>
            </div>
          </div>
         
        </div>
      <div className="modal-actions">
        <button className="no" variant="secondary" onClick={onClose}>
          Close
        </button>
        <button className="yes" variant="primary" onClick={handleEditProduct}>
          Update
        </button>
      </div>
    </div>
  </div>
  );
};

export default EditProductModal;