import { useEffect, useState } from "react"
import { db } from "./config/firebase.config"
import { collection, getDocs } from "firebase/firestore"
import { Product } from "./types/product.interface"

function App() {
  const [products, setProducts] = useState<any>([])

	useEffect(() => {
		const productRef = collection(db, "products")
		getDocs(productRef).then((snapshot) => {
			const products = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))
			setProducts(products)
		})
	}, [])

	return (
		<>
			{products.map((product: Product) => (
				<div key={product.id}>{product.basic.name}</div>
			))}
		</>
	)
}

export default App
