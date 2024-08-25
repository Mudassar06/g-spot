import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import {v4 as uuid} from 'uuid'
interface AutocompleteResponse {
    description: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    place_id: string;
    reference: string;
    types: string[];
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

const debounce = <A extends any[]>(func: (...args: A) => void, delay: number): (...args: A) => void => {
    let timeoutId: NodeJS.Timeout;
    return (...args: A) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

interface AutocompleteAPIResponse {
    predictions: AutocompleteResponse[];
}

const fetchAutocomplete = async (input: string): Promise<AutocompleteAPIResponse> => {
    try {
        const response = await axios.get<AutocompleteAPIResponse>('https://api.olamaps.io/places/v1/autocomplete', {
            params: {
                input,
                api_key: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching autocomplete:', error);
        return { predictions: [] };
    }
};

interface InputProps {
    setPoints: Dispatch<SetStateAction<{ point1: string; point2: string }>>;
    points: { point1: string; point2: string };
}

const AutocompleteInput = ({ setPoints, points }: InputProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [results, setResults] = useState<AutocompleteResponse[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const debouncedFetchAutocomplete = useCallback(
        debounce(async (input: string) => {
            const data = await fetchAutocomplete(input);
            setResults(data.predictions);
            setDropdownOpen(true); 
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setInputValue(input);
        debouncedFetchAutocomplete(input);
    };

    const handleSelectResult = (result: AutocompleteResponse) => {
        setPoints({
            ...points,
            point2: `${result.geometry.location.lat},${result.geometry.location.lng}`,
        });
        setDropdownOpen(false);
        setInputValue(result.description);
    };

    return (
        <div>
            <input
                className='p-2 rounded-md border border-neutral-500'
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type to search..."
            />
            {dropdownOpen && results.length > 0 && (
                <ul className='p-2 rounded-md border mt-2 flex flex-col gap-2'>
                    {results.map((result, index) => (
                        <li
                            className='p-2 rounded-md bg-white border border-neutral-500 cursor-pointer' 
                            onClick={() => handleSelectResult(result)}
                            key={uuid()}
                        >
                            {result.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
