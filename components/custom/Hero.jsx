"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
  const [userInput,setUserInput]=useState();
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const {messages,setMessages}=useContext(MessagesContext);
  const [openDialog,SetOpenDialog]=useState(false);
  const CreateWorkspace=useMutation(api.workspace.CreateWorkspace)
  const router=useRouter();
  const onGenerate=async(input)=>{
    if(!userDetail?.name)
    {
      SetOpenDialog(true);
      return;
    }

    if(userDetail?.token<10)
      {
        toast('You Dont Have Enough Token! ');
        return;
      }

    const msg={
      role:'user',
    content:input
    }
   setMessages(msg);

   const workspaceId=await CreateWorkspace({
    user:userDetail._id,
    messages:[msg]
   });
   console.log(workspaceId);
   router.push('/workspace/'+workspaceId);
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 mt-28 xl:mt-42'>
        <h2 className='text-4xl font-bold'>{Lookup.HERO_HEADING}</h2>
        <p className='font-medium text-gray-400'>{Lookup.HERO_DESC}</p>

        <div className='w-full max-w-xl p-5 mt-3 border rounded-xl '
          style={{
            backgroundColor: Colors.BACKGROUND,
            borderColor: 'rgba(0, 255, 255, 0.4)', // Default border color for fallback
          }}>
        <div className='flex gap-2'>
          <textarea placeholder={Lookup.INPUT_PLACEHOLDER} 
          onChange={(event)=>setUserInput(event.target.value)}
          className='w-full h-32 bg-transparent outline-none resize max-h-56'
          />
        {userInput&& <ArrowRight 
        onClick={()=>onGenerate(userInput)}
        className='w-10 h-10 p-2 bg-blue-500 rounded-md cursor-pointer'/>}
        </div>
        <div>
          <Link className='w-5 h-5' />
        </div>
        </div>
        <div className='flex flex-wrap items-center justify-center max-w-2xl gap-3 mt-8'>
          {Lookup?.SUGGSTIONS.map((suggestion,index)=>(
            <h2 key={index}
            onClick={() =>onGenerate(suggestion)}
            className='p-1 px-2 text-sm text-gray-400 border rounded-full cursor-pointer hover:text-white'
            >{suggestion}</h2>
          ))}
        </div>
        <SignInDialog openDialog={openDialog} closeDialog={(v)=>SetOpenDialog(v)}/>
    </div> 

   
  )
}

export default Hero