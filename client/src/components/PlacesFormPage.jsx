import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Perks from './Perks';
import PhotosUploader from './PhotosUploader';
import AccountNav from './AccountNav';

const PlacesFormPage = () => {
    const {id} = useParams();

    const [title,setTitle] =  useState('');
    const [address,setAddress] = useState('');
    const [description,setDescription]=useState('');
    const [perks,setPerks]=useState([]);
    const [addedPhoto,setAddedPhoto]=useState([]);
    const [extraInfo,setExtraInfo]=useState('');
    const [checkIn,setCheckIn]=useState('');
    const [checkOut,setCheckOut] =useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect,setRedirect] = useState(false);
    const [price,setPrice] = useState(15000);

    useEffect(()=>{
        if(!id)
        {
            return ;
        }
        axios.get('/places/' + id).then(response => {    //editing existing places
            const {data} =response;
            setTitle(data.title);    setAddress(data.address);  setAddedPhoto(data.photos);     setDescription(data.description);
            setPerks(data.perks);    setExtraInfo(data.extraInfo);    setCheckIn(data.checkIn);     setCheckOut(data.checkOut);    
            setMaxGuests(data.maxGuests);   setPrice(data.price);
        });
    }, [id]);

    function inputHeader(text){
        return (    <p className="text-2xl mt-4">{text}</p> );
    }
    function inputDescription(text) {
        return (    <p className="text-gray-500 text-sm">{text}</p>);
    }
    function preInput(header,description){
        return(<>
                    {inputHeader(header)}
                    {inputDescription(description)}
                </>);
    }
    

    async function addNewPlace(event){
        event.preventDefault();
        const placeData = {
            title, address, addedPhoto,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price,
          };
        //how do we know if we have to update an existing place or save a new place
        if(id) //if we have an id, it is an update
        {
            await axios.put('/places', {
                id, ...placeData
            }); 
            setRedirect(true);
        }
        else
        {   //otherwise it is a new place
            await axios.post('/places',//putting new place into database, 
              placeData
            );
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }
  return (
    <>
    <div>
        <AccountNav/>
        <form onSubmit={addNewPlace}>
            {preInput('Title','Title for your place, should be short and catchy as in advertisement')}
            <input type="text" value={title} onChange={ev=>setTitle(ev.target.value)} placeholder='title, for example: My vacation home'/>
            {preInput('Address','Address to this place')}
            <input type="text" value={address} onChange={ev=>setAddress(ev.target.value)} placeholder='address'/>
            {preInput('Photos','more = better')}

            <PhotosUploader addedPhoto={addedPhoto} onChange={setAddedPhoto}/>
            
            {preInput('Descriptions','Description of the place')}
            <textarea value={description} onChange={ev=>setDescription(ev.target.value)} />
            {preInput('Perks','Select all the perks of your place')}

            <div className="grid gap-2 mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <Perks selected={perks} onChange={setPerks}/>
            </div>

            {preInput('Extra info','house rules, Entrance')}
            <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}/>
            {preInput('Check In & Check Out','add check in and out times, remember to have some time window for cleaning the room between guests')}
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                <div>
                    <h3>Check in Time</h3>
                    <input type="text" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} placeholder="14.00"/>
                </div>
                <div>
                    <h3>Check Out Time</h3>
                    <input type="text" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} placeholder='11.00'/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Max number of guests</h3>
                    <input type="number" value={maxGuests} onChange={ev=>setMaxGuests(ev.target.value)} />
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Price per night</h3>
                    <input type="number" value={price} onChange={ev=>setPrice(ev.target.value)} />
                </div>                
            </div>
                <button className='primary my-4'>Save</button>
        </form>
    </div> 
    </>
  )
}

export default PlacesFormPage
