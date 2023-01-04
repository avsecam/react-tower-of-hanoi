import React from "react"
import "./styles.css"

export const GameContainer = () => {
	return (
		<>
			<div className="container">
				<div className="platform">
					<Rod onClick={() => {console.log("clicked0")}}/>
					<Rod onClick={() => {console.log("clicked1")}}/>
					<Rod onClick={() => {console.log("clicked2")}}/>
				</div>
			</div>
		</>
	)
}

type GameState = number[][] // [ [1, 2], [3], [] ]

const Rod = ({ onClick }: { onClick: () => void }) => {
	return (
		<button className="rod" onClick={onClick}>
			<div></div>
		</button>
	)
}