import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import api from '../service/api';
import { useHistory } from "react-router-dom";

import {  FiPlus } from "react-icons/fi";
import {  MdClose } from "react-icons/md";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";

import mapIcon from '../utils/mapIcon';

interface imagesPreview {
  name: string;
  url: string;
}

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<imagesPreview[]>([]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat: latitude, lng: longitude } = event.latlng;

    setPosition({ latitude, longitude });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); 

    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    images.forEach(image => {
      data.append('images', image);
    });

    api.post('orphanages', data)
      .then(res => {
        alert('Cadastro realizado com Sucesso!');
        history.push('/app');
      })
  };

  const handleOnSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files);
      
      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map(image => {
        return {
          name: image.name,
          url: URL.createObjectURL(image),
        }
      });

      setPreviewImages(selectedImagesPreview);
    }
  };

  const handleDeleteImage = (imageDeleted: imagesPreview) => {
    const newPreviewImages = previewImages.filter(image => {
      if (imageDeleted.url !== image.url) {
        return image;
      } 
      return null;
    });
    
    const newImages = images.filter(image => {
      if (image.name !== imageDeleted.name) {
        return image;
      }
      return null;
    });

    setPreviewImages([ ...newPreviewImages ]);
    setImages([ ...newImages ]);
  }
 
  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.2092052,-49.6401092]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0 && position.longitude !== 0 && (
                <Marker 
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude,position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <div key={image.url} className="images-content">
                      <span onClick={() => handleDeleteImage(image)} className="delete-button">
                        <MdClose size={16} color="#FF669D"/>
                      </span>
                      <img src={image.url} alt={image.name}/>
                    </div>
                  )
                })}
                <label htmlFor="files" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
                <input multiple onChange={handleOnSelectImage} id="files" type="file"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Abertura</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  onClick={() => setOpenOnWeekends(true)}
                  className={open_on_weekends ? 'active' : ''}
                >
                  Sim
                </button>
                <button 
                  type="button"
                  onClick={() => setOpenOnWeekends(false)}
                  className={!open_on_weekends ? 'active' : ''}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
