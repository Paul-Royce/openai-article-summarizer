import React from 'react'
import { useState, useEffect } from 'react'
import {copy, linkIcon, loader, tick} from "../assets"
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {

  const [article, setArticle] = useState({
    url: "",
    summary: ""
  })

  useEffect(()=> {
    /* create a constant that checks if an aticles object is present in the localStorage */
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'))

    // CHECK if the articles obj existsm if yes update the allArticles state with this obj
    if(articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage)
    }
  }, [])

  const [allArticles, setAllArticles] = useState([])
  const [copied, setCopied] = useState('')

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery()

  const handleSubmit = async (e)=> {
    e.preventDefault()
    const {data} = await getSummary({articleUrl: article.url})

    if(data?.summary) {
      const newArticle = {...article, summary: data.summary}
      setArticle(newArticle)

      const updatedAllArticles = [newArticle, ...allArticles]

      /* update localstorage with the new JSON data provided by the user search */
      setAllArticles(updatedAllArticles)
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))  /* JSON.stringify because localStorage accepts only strings or JSON */
    }
  }

  const handleCopy = (copyUrl)=> {
    setCopied(copyUrl)
    /* copy the URL in the clipboard */
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopied(false), 2000)

  } 

  return (
    <section className='w-full max-w-xl mt-16'>
        {/* search */}
        <div className='flex flex-col w-full gap-2'>
          <form 
          onSubmit={handleSubmit}
            className='relative flex items-center justify-center '
          >
           <img 
            src={linkIcon} 
            alt="link_icon" 
            className='absolute left-0 w-5 my-2 ml-3 '
           />
           <input 
            type="url"
            placeholder='Enter a URL'
            value={article.url}
            onChange={ e => setArticle(prev => ({...prev, url: e.target.value}))}
            required
            className='url_input peer'
           />

           <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700:'
           >
            ↵  {/* the symbol is the content */}
           </button>
          </form>
          {/* Browse URL History */}
          <div className='flex flex-col gap-1 overflow-y-auto max-h-60'>
              {allArticles.map((item, index) => (
                <div 
                  key={`link-${index}`}
                  onClick={()=> setArticle(item)}
                  className='link_card'
                >
                  <div className="copy_btn" onClick={()=> handleCopy(item.url)}>
                    <img 
                      src={copied === item.url ? tick : copy} 
                      alt='copy icon' 
                      className=' w-[40%] h-[40%] object-contain' 
                    />
                  </div>
                  <p
                    className='flex-1 text-sm font-medium text-blue-700 truncate '
                  >
                    {item.url}
                  </p>
                </div>
              ))}

          </div>
        </div>

        {/* Display results */}
        <div
          className='flex items-center justify-center max-w-full my-10 '
        >
          {
          isFetching ?
             <img src={loader} alt='loader' className='object-contain w-20 h-20 ' />
             :
            error ? 
            <p className='text-center text-black '>
              Well, ehmm that wasn't supposed to happen...
              <br />
              <span className='text-gray-700 '>
                {error?.data?.error}
              </span>
            </p>
            :
            (article.summary && (
              <div className='flex flex-col gap-3 '>
                <h2 className='text-xl font-bold text-gray-600'>
                  Article <span className=' blue_gradient'>Summary</span>
                </h2>
                
                <div className='summary_box'>
                  <p className='text-sm font-medium text-gray-700 '>{article.summary}</p>

                </div>
              </div>
            ))

          }
        </div>
    </section>
  )
}

export default Demo