import logo from './logo.svg';
import { useEffect } from 'react';
import config from './aws-exports'

import { API } from 'aws-amplify'
import { listBlogs } from './graphql/queries'
import { createBlog } from './graphql/mutations'
import { onCreateBlog } from './graphql/subscriptions'

function App() {
  useEffect(() => {
    const getData = async() => {
      const data = await API.graphql({ query: listBlogs})
      console.log(data)
    }
    getData()

    const subscription = API.graphql( {query: onCreateBlog
    }).subscribe({
      next: blogData => {
        console.log(blogData)
        getData()
      },
      error: (err) => {
        console.log(err)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createNewBlog = async() => {
    const name = prompt('what is the blog name?')
    const newBlog = await API.graphql({
      query: createBlog,
      variables: { input: { name }}
    })
  }
  return (
    <div className="App">
      <button onClick={createNewBlog}>Input</button>
    </div>
  );
}

export default App;
