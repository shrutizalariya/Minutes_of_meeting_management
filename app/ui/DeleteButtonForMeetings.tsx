"use client" 

import React from 'react' 
import { DeleteMeetingAction } from '../actions/DeleteMeetingAction'

function DeleteButtonForMeetings(paramas:any) { 
    const {id} = paramas; 
  return ( 
    <button onClick={()=>{ 
        DeleteMeetingAction(id) 
    }}>Delete</button> 
  ) 
} 
 
export default DeleteButtonForMeetings;