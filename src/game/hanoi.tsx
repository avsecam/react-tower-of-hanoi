import React, { useState } from "react"
import "./styles.css"

const amountOfRods: number = 3
const discHeight: number = 30
const initialState: GameState = {
	activeDisc: undefined,
	rods: [
		[
			{ id: 0, color: "red", position: 0 },
			{ id: 1, color: "blue", position: 1 },
			{ id: 2, color: "green", position: 2 },
		],
		[],
		[],
	]
}

type DiscProps = {
	id: number,
	color: string,
	position: number, // Position from bottom of stack. 0 is bottommost
	active?: boolean,
}
type GameState = {
	activeDisc?: DiscProps,
	rods: DiscProps[][] // [ [...], [...], [] ]
}

export function GameContainer(): JSX.Element {
	const [state, setState] = useState<GameState>(initialState)

	function drawGame(): JSX.Element {
		let rods: JSX.Element[] = Array<JSX.Element>(amountOfRods).fill(<></>).map((val, idx) =>
			<Rod key={idx} onClick={() => handleRodClick(idx)}>
				{state.rods[idx].map(val => (
					<Disc id={val.id} color={val.color} position={val.position} active={val.active} key={val.id} />
				))}
			</Rod>
		)

		console.log(rods)

		return (
			<>
				{rods}
			</>
		)
	}

	function handleRodClick(key: number): void {
		const topDisc: DiscProps | undefined = state.rods[key].pop()

		// Make a disc active by lifting it up
		if (state.activeDisc === undefined) {
			setState(() => {
				return { ...state, activeDisc: topDisc }
			})
		}

		// Place an active disc onto a rod
		else {
			
		}
	}

	return (
		<>
			<div className="container">
				<div className="activeDiscContainer" style={{ height: discHeight }}>
					{(state.activeDisc)
						? <Disc id={state.activeDisc?.id ?? 0} color={state.activeDisc?.color ?? "white"} position={0} />
						: null}
				</div>
				<div className="platform">
					{drawGame()}
				</div>
			</div>
		</>
	)
}

function Rod({
	onClick,
	children
}: {
	onClick?: () => void,
	children?: JSX.Element[] | JSX.Element,
}) {
	return (
		<button className="rodContainer" onClick={onClick}>
			<>
				<div className="rod"></div>
				{children}
			</>
		</button>
	)
}

function Disc({ id, color, position, active }: DiscProps) {
	return (
		<div className="disc" style={{ backgroundColor: color, width: `${(amountOfRods - id) * (200 / amountOfRods)}px`, bottom: `${discHeight * position}px` }}></div>
	)
}