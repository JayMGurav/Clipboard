import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { clipboard, ipcRenderer } from 'electron';


import database from './database.js'




function Application() {
  const [clippings, setClippings] = useState([]);

  useEffect(() => {
    
    ipcRenderer.on('create-new-clipping', addClipings)
    ipcRenderer.on('copy-clipping', handleWriteTOClipboard)
    fetchClippings();
  }, []);

  function fetchClippings(){
    database('clippings')
      .select()
      .then(clippings => setClippings(clippings));
  }

  const addClipings = () => {
    const content = clipboard.readText();

    database('clippings')
      .insert({ content })
      .then(fetchClippings);
  }

  
  const handleWriteTOClipboard = () => {
    const firstClipping = clippings[0];
    if (firstClipping) {
      clipboard.writeText(firstClipping)
    }
  }

  return (
    <div className="container">
      <header className="controls">
        <button id="copy-from-clipboard" onClick={addClipings}>Copy from clipboard</button>
      </header>

      <section className="content">
        <div className="clippings-list">
          {clippings.map((content) => {
            return (
              // console.log(content)
              <Clippings id={content.id} key={content.id} content={content.content} onRemove={(id) => {
                database('clippings').where('id',id).delete().then(fetchClippings)
             }}></Clippings>
           )
         })}
        </div>
      </section>
    </div>
  )
}

const Clippings = ({ content,id,onRemove}) => {
  return (
    <article className="clippings-list-item">
      <div className="clipping-text" disable="true" >
        {content}
      </div>
      <div className="clipping-controls">
        <button onClick={()=>writeTOClipboard(content)}>&rarr; Clipboard</button>
        <button>Update</button>
        <button className="remove-clipping" onClick={()=>onRemove(id)}>Remove</button>
      </div>
    </article>
  )
}


render(<Application />, document.getElementById('application'));