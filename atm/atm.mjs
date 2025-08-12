// import fetch from 'node-fetch';
async function getBankAccount(card, pin) {
    try {
        const res = await fetch(`http://localhost:3000/switch/${card}/${pin}`);
        //if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}

getBankAccount("0000009090", "1233").then(console.log);