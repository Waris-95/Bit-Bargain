import axios from "axios";
import { useEffect, useState } from "react";
import AmountInput from "./AmountInput";
import LoadingSkeleton from "./LoadingSkeleton";
import ResultRow from "./ResultRow";
import { sortBy } from 'lodash';
import useDebouncedEffect from 'use-debounced-effect';

type CachedResult = {
  provider: string;
  btc: string;
};

type OfferResults = { [keys: string]: string };

const defaultAmount = '100';

function App() {
  const [prevAmount, setPrevAmount] = useState(defaultAmount);
  const [amount, setAmount] = useState(defaultAmount);
  const [cachedResults, setCachedResults] = useState<CachedResult[]>([]);
  const [offerResults, setOfferResults] = useState<OfferResults>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://rds54favbg.us.aircode.run/cachedValues')
      .then(res => {
        setCachedResults(res.data);
        setLoading(false);
      });
  }, []);

  useDebouncedEffect(() => {
    if (amount === defaultAmount) {
      return;
    }
    if (amount !== prevAmount) {
      setLoading(true);
      axios
        .get(`https://rds54favbg.us.aircode.run/offers?amount=${amount}`)
        .then(res => {
          setLoading(false);
          setOfferResults(res.data);
          setPrevAmount(amount);
        })
    }
  }, 300, [amount]);

  const sortedCache: CachedResult[] = sortBy(cachedResults, 'btc').reverse();
  const sortedResults: CachedResult[] = sortBy(Object.keys(offerResults).map(provider => ({
    provider,
    btc: offerResults[provider]
  })), 'btc').reverse();

  const showCached = amount === defaultAmount;

  const rows = showCached ? sortedCache : sortedResults;

  return (
    <div>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="uppercase text-8xl text-center font-light bg-gradient-to-br from-purple-100 to-white-100 bg-clip-text text-transparent from-30%">Bit Bargain</h1>
        <h2 className="text-2xl text-center font-light ">Find The Cheapest BTC</h2>
        <div className="flex justify-center mt-6">
          <AmountInput
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="mt-6">
          {loading && (
            <LoadingSkeleton />
          )}
          {!loading && rows.map(result => (
            <ResultRow
              key={result.provider}
              providerName={result.provider}
              btc={result.btc}
            />
          ))}
        </div>
      </main>
      {/* Footer section with GitHub, LinkedIn, and Portfolio links */}
      <footer className="text-center py-4">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <p className="text-sm">
          Made By Abdul Waris:
          <a href="https://github.com/Waris-95" className="ml-2 text-blue-500" target="_blank" rel="noopener noreferrer">GitHub</a>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path></svg>  */}

          <span className="mx-2">•</span>
          <a href="https://www.linkedin.com/in/abdul-waris-aa1234aw/" className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"   width="16" height="16" fill="currentColor"><path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"></path></svg> */}

          <span className="mx-2">•</span>
          <a href="https://aw-abduls-portfolio.vercel.app" className="text-blue-500" target="_blank" rel="noopener noreferrer">Portfolio</a>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"   width="16" height="16" fill="currentColor"><path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path></svg>  */}

        </p>
      </footer>
    </div>
  );
}

export default App;
