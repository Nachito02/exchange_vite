import axios from 'axios'




export const fetchRedeems = async (apiUrl) => {
    const redeems = await axios.get(`${apiUrl}`)
    return redeems;
}



export const updateRedeem = async (apiUrl, redeem) => {
    const body = {
        burn_tx_hash: redeem.burn_tx_hash,
        shipping_paid_status: "true",
        shipping_tx_hash: redeem.shipping_tx_hash
    }
    const updatedRedeem = await axios.post(`${apiUrl}`, body)
    return updatedRedeem;
}