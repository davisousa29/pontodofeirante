import React from 'react'
import {Field, ErrorMessage} from "formik"



export default function campoPreencher(titulo, subtitulo, value, type, borderColor) {

    const borderClass = borderColor ? borderColor : 'border-primaryColor';

    return(
        <div className=" mb-3 flex flex-col">
            <span className=' text-primaryColor font-bold'>{titulo}</span>
            <Field type={type} name={value} className={` border-2 rounded-md w-full h-[42px] pl-2 ${borderClass}`}
            placeholder={subtitulo}/>
            <div className='overflow-scroll no-scrollbar'>
                <ErrorMessage name={value} component="div" className='error text-red-600 text-sm ml-3'/>
            </div>
        </div>
    )
}