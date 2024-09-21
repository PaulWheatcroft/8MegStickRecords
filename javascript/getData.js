async function getData() {
    const url = "./data/releases.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const { createApp, ref } = Vue
        createApp({
            setup() {
                const releases = json
                return {
                    releases
                }
            }
        }).mount('#app')
    } catch (error) {
        console.error(error.message);
    }
}
getData()