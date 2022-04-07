// import {useRef, useState, useEffect} from "react";

function SavedWord(props) {

    return(
        <span>{props.thewords.join(', ')}</span>
    )
}
export default SavedWord;