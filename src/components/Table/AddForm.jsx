import React, { useState , useEffect} from "react";
import "./Modal.css";
import axios from 'axios';
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

const AddForm = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const fetchCategories = async () => {
   
      await axios.get("https://dollarwala-server-production.up.railway.app/api/categories")
      .then((response)=>{
        setCategories(response.data);
      })
      .catch((error)=>{
        console.error("Error fetching categories:", error);
      })
  
    }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category and associated products?")) {
        await axios.delete(`https://dollarwala-server-production.up.railway.app/api/categories/${categoryId}`)
        .then((response)=>{
          fetchCategories();
          window.alert(response.data.message)
        }). catch ((error) =>{
          window.alert(error.response.data.message)
          console.error("Error deleting category:", error);
        })
      }
    }

  const handleAddCategory = async () => {
    
      axios.post("https://dollarwala-server-production.up.railway.app/api/categories", { category: newCategory },
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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", document.getElementById("title").value);
      formData.append("price", parseFloat(document.getElementById("price").value));
      formData.append("description", document.getElementById("description").value);
      formData.append("category", selectedCategory);
      formData.append("quantity", quantity); 

      const fileInput = document.getElementById("fileInput");
      if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);
      }
      formData.append("categories", selectedCategory);


      await axios.post("https://dollarwala-server-production.up.railway.app/api/products", formData,
      )
      .then((response)=>{
        onClose();
        window.alert(response.data.message);
      })
      .catch((error)=>{
        window.alert(error.response.data.message);
      })
        
    } catch (error) {
      window.log(error.response.data.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title">Add Product</span>
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label>Title</label>
            <input type="text" id="title" />
          </div>
          <div className="modal-field">
            <label>Price</label>
            <input type="number" id="price" />
          </div>
          <div className="modal-field">
            <label>Description</label>
            <input type="text" id="description" />
          </div>
          <div className="modal-field">
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={handleQuantityChange} />
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
                    checked={selectedCategory === category.category}
                    onChange={handleCategoryChange}
                  />
                  {category.category} 
                  <DeleteOutline
                      className="delete-icon"
                      onClick={() => handleDeleteCategory(category._id)}
                    />
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

          <div className="modal-field">
            <label>Choose File</label>
            <input type="file" id="fileInput" />
          </div>
        </div>
        <div className="modal-actions">
          <button  className="no" onClick={onClose}>Cancel</button>
          <button  className="yes" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AddForm;
