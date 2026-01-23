"use client" 

import React from 'react' 
import { DeleteMeetingTypeAction } from '../actions/DeleteMeetingTypeAction'

function DeleteButton(paramas:any) { 
    const {id} = paramas; 
  return ( 
    <button onClick={()=>{ 
        DeleteMeetingTypeAction(id) 
    }}>Delete</button> 
  ) 
} 
 
export default DeleteButton;