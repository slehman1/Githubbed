import React from "react"
import { Container } from "react-bootstrap";

function StarredRepos(props){

    function onDragStart(event) {
        event
          .dataTransfer
          .setData('text/plain', event.target.id);
      }

    return (
        <Container id="starred-repos" onDragStart={(e) => onDragStart(e)} draggable={true} style={{border: "solid", borderRadius: "10px", display: props.display}}>
        <h2>Starred Repos</h2>
        {props.data.total.starredRepos.map((repo, index) => (
            <a key={index} target="_blank" rel="noopener noreferrer" href={repo.url}>{repo.name}</a>
        ))}

        </Container>
    )

}

export default StarredRepos;