import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const fetchCountries = async () => {
    const countries = await axios.get(`${process.env.import.meta.env.VITE_DASHBOARD_URL}/api/routes/zonesRoute`)
    return countries;
}
