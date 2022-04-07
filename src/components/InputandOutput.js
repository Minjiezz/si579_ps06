import {useRef, useState} from "react";
import SavedWord from "./SavedWord";

function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if (typeof property !== "function") {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for (const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if (!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for (const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}

function InputandOutput() {
    const inputRef = useRef('');
    const [wordresults, setWordresults] = useState('');
    const [searchwhat, setSearchwaht] = useState('');
    const [savewords, setSavewords] = useState([]);

    function searchRhyming() {
        setWordresults('Loading...');
        fetch(`https://api.datamuse.com/words?${new URLSearchParams({
            rel_rhy: inputRef.current.value,
        }).toString()}`)
            .then((response) => response.json())
            .then((data) => showRhymingonPage(data));
    }

    function searchSynonyms() {
        setWordresults('Loading...');
        fetch(`https://api.datamuse.com/words?${new URLSearchParams({
            ml: inputRef.current.value,
        }).toString()}`)
            .then((response) => response.json())
            .then((json) => showSynonymonPage(json));
    }

    function showRhymingonPage(data) {
        if (data.length === 0) {
            setWordresults('No results');
        } else {
            setSearchwaht(`Words that rhyme with ${inputRef.current.value}:`);
            const res = groupBy(Object.values(data), 'numSyllables');
            let alltheResults = [];
            for (const key in res) {
                alltheResults.push(
                    <h3 key={Math.random()}>{`Syllabus:${key}`}</h3>,
                    <ul key={Math.random()}>{res[key].map((eachword) => {
                        return (
                            <li key={Math.random()}>{eachword.word}
                                <button className='btn btn-outline-success' onClick={() => {
                                    setSavewords((savewords) => {
                                        const theWordList = savewords.concat();
                                        theWordList.push(eachword.word);
                                        console.log(setSavewords);
                                        return theWordList
                                    })}}>Save</button>
                            </li>
                        );
                    })}
                    </ul>);
            }
            setWordresults(alltheResults);
        }
        // inputRef.current.value = '';
    }

    function showSynonymonPage(data) {
        if (data.length === 0) {
            setWordresults('No results');
        } else {
            setSearchwaht(`Words with a similar meaning to ${inputRef.current.value}:`);
            const res = groupBy(Object.values(data), 'numSyllables');
            let alltheResults = [];
            for (const key in res) {
                alltheResults.push(
                    <ul key={Math.random()}>{res[key].map((eachword) => {
                        return (
                            <li key={Math.random()}>{eachword.word}
                                <button className='btn btn-outline-success'
                                        onClick={() => {
                                            setSavewords((savewords) => {
                                                const theWordList = savewords.concat();
                                                theWordList.push(eachword.word);
                                                console.log(setSavewords);
                                                return theWordList
                                            })
                                        }}>Save</button>
                            </li>
                        );
                    })}
                    </ul>
                );
            }
            setWordresults(alltheResults);
        }
        // inputRef.current.value = '';
    }

    function keydownRhy(e) {
        if (e.key === 'Enter') {
            searchRhyming();
        }
    }

    function keydownSyn(e) {
        if (e.key === 'Enter') {
            searchSynonyms();
        }
    }

    return(
        <>
        <div className="row">
            <div className="col">Saved words: <SavedWord thewords={savewords}/></div>
        </div>
        <div className="row">
            <div className="input-group col">
                <input ref={inputRef} className="form-control" type="text" placeholder="Enter a word"/>
                <button type="button" className="btn btn-primary" onClick={searchRhyming} onKeyDown={keydownRhy} tabIndex="0">Show rhyming words</button>
                <button type="button" className="btn btn-secondary" onClick={searchSynonyms} onKeyDown={keydownSyn} tabIndex="0">Show synonyms</button>
            </div>
        </div>
        <div className="row">
            <h2 className="col">{searchwhat}</h2>
        </div>
        <div className="output row">
            <output className="col">{wordresults}</output>
        </div>
        </>
    )
}

export default InputandOutput;
