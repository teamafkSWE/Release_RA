import React from "react";
import {Button} from "@grafana/ui";

interface CollegamentoProps {
    id: string
    nome: string
    links: { predictor: string, query: string }[]
    onModify: (id: string) => void
    onRemove: (id: string) => void
}

const Collegamento: React.FC<CollegamentoProps> = (props) => {
    const predictors: string[] = []
    const nodes: string[] = []
    props.links.forEach(link => {
        predictors.push(link.predictor);
        nodes.push(link.query)
    })
    return (
        <>
            <div style={{width: "100%", border: "1pt solid white", borderRadius: "3pt", minWidth: "12rem", marginTop: ".8rem"}}>
                <p style={{textAlign: "center", borderBottom: "1pt solid white", margin: "0", padding: "0.4rem 0 0.4rem", fontSize: "1.2rem"}}>{props.nome}</p>

                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <div style={{width: "100%"}}>
                        <p style={{
                            textAlign: "center",
                            width: "100%",
                            margin: "0",
                            padding: "0.4rem 0.6rem 0.4rem",
                            borderRight: "1pt solid white",
                            borderBottom: "1pt solid white"
                        }}>
                            Predictor
                        </p>
                        {predictors.map((predictor, index) =>
                            <p style={{textAlign: "center", width: "100%", margin: "0", padding: "0.2rem 0.6rem 0.2rem"}} key={index}>
                                {predictor}
                            </p>
                        )}
                    </div>
                    <div style={{width: "100%"}}>
                        <p style={{textAlign: "center", width: "100%", margin: "0", padding: "0.4rem 0.6rem 0.4rem", borderBottom: "1pt solid white"}}>
                            Node
                        </p>
                        {nodes.map((node, index) =>
                            <p style={{textAlign: "center", width: "100%", margin: "0", padding: "0.2rem 0.6rem 0.2rem"}} key={index}>
                                {node}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", width: "100%", margin: ".75rem 0 .5rem"}}>
                <Button style={{margin: "0 .5rem 0"}} onClick={() => props.onModify(props.id)}>Edit</Button>
                <Button style={{margin: "0 .5rem 0"}} onClick={() => props.onRemove(props.id)}>Disconnect</Button>
            </div>
        </>
    )
}

export default Collegamento