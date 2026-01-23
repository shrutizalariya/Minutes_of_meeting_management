"use client" 

import React from 'react' 
import { DeleteStaffAction } from '../actions/staff/DeleteStaffAction'

function DeleteButtonForMeetings(paramas:any) { 
    const {id} = paramas; 
  return ( 
    <button onClick={()=>{ 
        DeleteStaffAction(id) 
    }}>Delete</button> 
  ) 
} 
 
export default DeleteButtonForMeetings;