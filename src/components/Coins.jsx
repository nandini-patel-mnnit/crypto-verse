import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Baseurl } from './baseUrl';
import Loader from './Loader';
import Header from './Header';
import { Link } from 'react-router-dom';
import './Res.css';

const Coins = () => {
  const [ loading, setLoading ] = useState(true);
  const [ coins, setCoins ] = useState([]);
  const [ currency, setCurrency ] = useState('usd');
  const [ search, setSearch ] = useState('');
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  useEffect(() => {
    const setCoinsData = async () => {
      const { data } = await axios.get(`${Baseurl}/coins/markets?vs_currency=${currency}`);
      console.log(data);
      setCoins(data);
      setLoading(false);
    }
    setCoinsData();
  }, []);

  return (
    <>
      {
        loading ? <Loader /> : (
          <>
            <Header />
            <div className="search-bar">
              <input type="text"
              placeholder='Search your coins...'
              onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className='btns'>
              <button onClick={() => setCurrency('inr')}>inr</button>
              <button onClick={() => setCurrency('usd')}>usd</button>
            </div>
            {
              coins.filter((data) => {
                if(data === '') {
                  return data;
                }
                else if(data.name.toLowerCase().includes(search.toLowerCase())) {
                  return data;
                }
              }).map((coinData, i) => {
                return (
                  <CoinCard coinData={coinData} i={i} currencySymbol={currencySymbol} id={coinData.id} />
                )
              })
            }
          </>
        )
      }
    </>
  );
}

const CoinCard = ({ coinData, i, currencySymbol, id }) => {
  const profit = coinData.price_change_percentage_24h > 0;
  return (
    <Link to={`/coins/${id}`} style={{color:'white', textDecoration:'none'}}>
      <div key={i} className='ex-cards'>
        <div className="image">
          <img height={'80px'} src={coinData.image} alt="error" />
        </div>
        <div className="name">
          {coinData.name}
        </div>
        <div className="price">
          {currencySymbol} {coinData.current_price.toFixed(0)}
        </div>
        <div style={profit ? {color:'green'} : {color:'red'}} className="rank">
          {profit ? '+' + coinData.price_change_percentage_24h.toFixed(2) : coinData.price_change_percentage_24h.toFixed(2)}
        </div>
      </div>
    </Link>
    
  );
}

export default Coins;
