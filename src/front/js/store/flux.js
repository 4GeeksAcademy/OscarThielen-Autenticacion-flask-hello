const API_URL = "https://improved-space-guacamole-5gq5gpp4x9p7hrrp-3001.app.github.dev/api"
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			syncTokenFromSessionStore: () => {
				const token = sessionStorage.getItem("token");
				console.log("Aplication just loaded, synching the session storage token");
				if (token && token != "" && token != undefined) setStore({token: token})
			},

			logout: () => {
				sessionStorage.removeItem("token");
				console.log("login out");
				setStore({token: null})
			},

			login: async (email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};
				try{
					const resp = await fetch (API_URL + '/token', opts)
					if(resp.status !== 200) {
						alert("There has been some error");
						return false
					}
					const data = await resp.json();
					console.log("this came from the backend", data);
					sessionStorage.setItem("token", data.access_token)
					setStore ({token: data.access_token})
					return true;
				}
				catch(error){
					console.error("Thera was an error")
				}
			},

			signup: async (email, password) => {
				const infoNewUser = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};
				try {
					const resp = await fetch ('https://improved-space-guacamole-5gq5gpp4x9p7hrrp-3001.app.github.dev/api/user', infoNewUser)
					if(resp.status != 200) {
						alert("There has been some error");
						return false		
					}
				}
				catch(error){
					console.error("Error fatal")
				}
			},

			getMessage: async () => {
				try {
				  const store = getStore();
				  const opts = {
					headers: {
					  "Authorization": "Bearer " + store.token
					}
				  };
				  // fetching data from the backend
				  const resp = await fetch(process.env.BACKEND_URL + "/api/hello", opts);
				  const data = await resp.json();
				  setStore({ message: data.message });
				  return data;
				} catch (error) {
				  console.log("Error loading message from backend", error);
				}
			  },
			  
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
