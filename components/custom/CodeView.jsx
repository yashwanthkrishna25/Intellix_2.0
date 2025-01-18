"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { countToken } from './ChatView';
import { UserDetailContext } from '@/context/UserDetailContext';

function CodeView() {
  const {id}=useParams();
  const [activeTab,setActiveTab]=useState('code');
  const { userDetail,setUserDetail } = useContext(UserDetailContext);
  const [files,setFiles]=useState(Lookup?.DEFAULT_FILE);
  const {messages,setMessages}=useContext(MessagesContext);
  const UpdataFiles=useMutation(api.workspace.UpdataFiles)
  const convex=useConvex();
  const [loading,setLoading]=useState(false);
  const UpdateTokens=useMutation(api.users.UpdateToken);

  useEffect(()=>{
   id&&GetFiles();
  },[id])

  const GetFiles= async()=>{
    setLoading(true);
    const result=await convex.query(api.workspace.GetWorkspace,{
      workspaceId:id
    });
    const mergedFiles={...Lookup.DEFAULT_FILE,...result?.fileData}
    setFiles(mergedFiles);
    setLoading(false);
  }

 useEffect(() => {
     if (Array.isArray(messages) && messages.length > 0) {
       const role = messages[messages.length - 1].role;
       if (role === 'user') {
         GenerateAiCode();
       }
     }
   }, [messages]);
  
  const GenerateAiCode=async()=>{
    setLoading(true)
    const PROMPT=JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
    const result=await axios.post('/api/gen-ai-code',{
      prompt:PROMPT
    });
    console.log(result.data);
    const aiResp=result.data;

    const mergedFiles={...Lookup.DEFAULT_FILE,...aiResp?.files}
    setFiles(mergedFiles);
    await UpdataFiles({
     workspaceId:id,
     files:aiResp?.files
    });

      const token=Number(userDetail?.token)-Number(countToken(JSON.stringify(aiResp)));
         //update tokens
         await UpdateTokens({
           userId:userDetail?._id,
           token:token
         })

         setUserDetail(prev=>({
          ...prev,
          token:token
        }))


    setActiveTab('code')
    setLoading(false);
   } 


  return (
    <div className='relative'>
      <div className='bg-[#181818] w-full p-2 border ' >
        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 justify-center rounded-full w-[140px] gap-3' >
          <h2 
          onClick={()=>setActiveTab('code')}className={`text-sm cursor-pointer ${activeTab=='code'&&'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Code</h2>
          <h2 
          onClick={()=>setActiveTab('preview')} className={`text-sm cursor-pointer ${activeTab=='preview'&&'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Preview</h2>
        </div>
      </div>
      <SandpackProvider 
      files={files}
      template="react" theme={'dark'}
        customSetup={{
                dependencies:{
                  ...Lookup.DEPENDANCY
                }
        }}
        options={{
          externalResources:['https://cdn.tailwindcss.com']
        }}>
    <SandpackLayout>
      {activeTab=='code'?<>
    <SandpackFileExplorer  style={{height:'80vh'}}/>
      <SandpackCodeEditor  style={{height:'80vh'}} />
      </>:
      <>
      <SandpackPreview     style={{height:'80vh'}} showNavigator={true}/>
      </>}
    </SandpackLayout>
  </SandpackProvider>
 {loading&&<div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full  flex items-center justify-center'>
    <Loader2Icon className='animate-spin h-10 w-10 text-white'/>
    <h2 className='text-white'>Generating your files...</h2>
  </div>}
    </div>
  )
}

export default CodeView