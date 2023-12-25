// Dashboard.js
import React, {useEffect,useState} from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    
    const [orders, setOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [overallSales, setOverallSales] = useState(0);
    const [dailyOrders, setDailyOrders] = useState([]);
    const [dailyCancelledOrders, setDailyCancelledOrders] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];
    const [shopReviews, setShopReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [users, setUsers] = useState([]); 
    const [ratingDistribution, setRatingDistribution] = useState([]);
    
    useEffect(() => {
        fetchOrderDetails();
        fetchShopReviews();
        fetchUsers();
    });
  
    const fetchOrderDetails = async () => {
        try {
        const response = await axios.get("https://dollar-wala-server.vercel.app/api/orders/all");
        const filteredOrders = response.data.filter(order => {
            return (
            order.status !== "cancelled"
            );
        });

        setOrders(filteredOrders);
        const filteredCancelledOrders = response.data.filter(order => {
            return (
            order.status === "cancelled"
            );
        });
        setCancelledOrders(filteredCancelledOrders);
        setOverallSales(
            filteredOrders.reduce((total, item) => total + item.totalPrice, 0)
        );

        const dailyOrders = filteredOrders.filter(order => order.createdAt.split('T')[0] === currentDate);
        setDailyOrders(dailyOrders);
        const dailyCancelledOrders = filteredCancelledOrders.filter(order => order.createdAt.split('T')[0] === currentDate);
        setDailyCancelledOrders(dailyCancelledOrders);

        } catch (error) {
        console.error("Error fetching order details:", error);
        }
    };

    const fetchShopReviews = async () => {

        try {
            const response = await axios.get(`https://dollar-wala-server.vercel.app/api/ShopReviews`);
            const reviewData = response.data;
            setShopReviews(reviewData);
            const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviewData.length;
            setAverageRating(averageRating); 
            const calculateRatingDistribution = () => {
                const distribution = Array(5).fill(0);
        
                shopReviews.forEach((review) => {
                distribution[review.rating - 1]++;
                });
        
                return distribution;
            };
        
            setRatingDistribution(calculateRatingDistribution());
        } catch (error) {
            console.error("Error fetching shop reviews", error);
        }
    }

    const fetchUsers = async () =>{
        try{
            const response = await axios.get(`https://dollar-wala-server.vercel.app/api/users`);
            const usersData = response.data;
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching user", error);
        }
    }

    const chartOptions = {
        scales: {
        y: {
            beginAtZero: true,
        },
        },
    };

    const dailyTotalAmount = dailyOrders.reduce((total, order) => total + order.totalPrice, 0);


    const overallOrdersData = {
        labels: ['Orders'],
        datasets: [
            {
            label: 'Overall Orders',
            data: [orders.length],
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            },
            {
            label: 'Cancelled Orders',
            data: [cancelledOrders.length],
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            },
        ],
    };

    const overallSalesData = {
        labels: orders.map(order => new Date(order.createdAt).toLocaleDateString('en-US')),
        datasets: [{
        label: 'Overall Sales',
        data: orders.map(order => order.totalPrice),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        }],
    };

    const shopReviewsData = {
        labels: ['Rating 1', 'Rating 2', 'Rating 3', 'Rating 4', 'Rating 5'],
        datasets: [
          {
            label: 'Reviews',
            data: ratingDistribution,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
          },
        ],
      };

    const dailySalesData = {
        labels: dailyOrders.map(order => new Date(order.createdAt).toLocaleDateString('en-US')),
        datasets: [{
            label: 'Daily Sales',
            data: dailyOrders.map(order => order.totalPrice),
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
        }],
    }

    const dailyOrdersData = {
        labels: ['Orders'],
        datasets: [{
            label: 'Overall Orders',
            data: [dailyOrders.length],
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
        },
        {
            label: 'Cancelled Orders',
            data: [dailyCancelledOrders.length],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    }

    const systemReach = {
        labels: ['Users'],
        datasets: [{
            label: 'users',
            data: [users.length],
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            },
        ],
    }

    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding:10,}}>

            <div className='card'>
                <h3>Overall Sales</h3>
                <p>{overallSales}</p>
                <Bar data={overallSalesData} options={chartOptions}/>
            </div>

            <div className='card'>
                <h3>Overall Orders</h3>
                <p> {orders.length + cancelledOrders.length}</p>
                <Bar data={overallOrdersData} options={chartOptions} />
            </div>

            <div className='card'>
                <h3>Shop Reviews</h3>
                 <p>{shopReviews.length} Reviews making { } 
              
                    { averageRating.toFixed(2)}
                    <i class="fa-solid fa-star" style={{color: 'b08504',marginLeft: '5px'}}></i>
                </p>
                <Bar data={shopReviewsData} options={chartOptions}/>
            </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between',padding:10 }}>

            <div className='card'>
                <h3>Daily Sales</h3>
                <p> {dailyTotalAmount}</p>
                <Bar data={dailySalesData} options={chartOptions} />
            </div>

            <div className='card'>
                <h3>Daily Orders</h3>
                <p> {dailyOrders.length + dailyCancelledOrders.length}</p>
                <Bar data={dailyOrdersData} options={chartOptions} />
            </div>

            <div className='card'>
                <h3>DollarWala Reach</h3>
                <p>{users.length}</p>
                <Bar data={systemReach} options={chartOptions} />
            </div>

        </div>
        </div>
        
    );
};

export default Dashboard;
