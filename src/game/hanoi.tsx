import React, { useState } from "react"
import "./styles.css"

const amountOfRods: number = 3
const discHeight: number = 30
const initialDiscs: DiscProps[] = [
	{ id: 0, color: "red", position: 0 },
	{ id: 1, color: "blue", position: 1 },
	{ id: 2, color: "green", position: 2 },
	{ id: 3, color: "orange", position: 3 },
	{ id: 4, color: "purple", position: 4 },
]
const initialState: GameState = {
	activeDisc: undefined,
	rods: [
		[...initialDiscs],
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
			<Rod key={idx} onHover={() => handleRodHover(idx)} onLeave={() => handleRodLeave(idx)} onClick={() => handleRodClick(idx)}>
				{state.rods[idx].map((disc, discIdx) => (
					<Disc id={disc.id} color={disc.color} position={discIdx} active={disc.active} key={disc.id} />
				))}
			</Rod>
		)

		return (
			<>
				{rods}
			</>
		)
	}

	function handleRodHover(key: number): void {
		// If no active disc, highlight the topmost disc in rod
		if (state.activeDisc === undefined) {
			const topDisc: HTMLElement | null = document.querySelector(`.rodContainer:nth-child(${key + 1})>.disc:last-child`)
			if (topDisc) topDisc.style.boxShadow = "0 0 1rem gold"
		}
		// Else, highlight the rod
		else {
			const rod: HTMLElement | null = document.querySelector(`.rodContainer:nth-child(${key + 1})>.rod`)
			if (rod) rod.style.boxShadow = "0 0 1rem gold"
		}
	}

	function handleRodLeave(key: number): void {
		const rod: HTMLElement | null = document.querySelector(`.rodContainer:nth-child(${key + 1})>.rod`)
		if (rod) rod.style.boxShadow = ""
		const topDisc: HTMLElement | null = document.querySelector(`.rodContainer:nth-child(${key + 1})>.disc:last-child`)
		if (topDisc) topDisc.style.boxShadow = ""
	}

	function handleRodClick(key: number): void {
		// Make a disc active by lifting it up
		if (state.activeDisc === undefined) {
			const activeDisc: DiscProps | undefined = state.rods[key].pop()
			setState({ ...state, activeDisc })
		}

		// Place an active disc onto a rod
		else {
			let legalMove: boolean = true
			const newRods: DiscProps[][] = state.rods.map((val, idx) => {
				if (idx !== key) return val // Return same rod

				if (state.activeDisc) { // Push the activeDisc if legal and return rod
					if (val.length > 0 && val[val.length - 1].id > (state.activeDisc?.id ?? -1)) { // Check if the disc can be put on top
						legalMove = false
					} else {
						val.push({ ...state.activeDisc, position: val.length })
					}
				}

				return val
			})

			setState(() => ({
				activeDisc: (legalMove) ? undefined : state.activeDisc,
				rods: newRods
			}))
		}
	}

	return (
		<>
			<div className="container">
				<div style={{height: "1rem"}}>
					{(state.rods[amountOfRods - 1].length === initialDiscs.length) ? <div>Game Over!</div> : null}
				</div>
				<div className="activeDiscContainer" style={{ height: discHeight }}>
					{(state.activeDisc)
						? <Disc id={state.activeDisc?.id ?? 0} color={state.activeDisc?.color ?? "white"} position={0} />
						: null}
				</div>
				<div className="platformContainer">
					<div className="platform">
						{drawGame()}
					</div>
					<div style={{ position: "relative", width: "100%", height: "10px", backgroundColor: "saddlebrown", zIndex: 100 }}></div>
				</div>
				<div className="actions">
					<button onClick={() => setState({
						rods: [[...initialDiscs], [], []]
					})}>Reset</button>
				</div>
			</div>
		</>
	)
}

function Rod({
	onHover,
	onLeave,
	onClick,
	children
}: {
	onHover?: () => void,
	onLeave?: () => void,
	onClick?: () => void,
	children?: JSX.Element[] | JSX.Element,
}) {
	return (
		<button className="rodContainer" onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick} style={{ height: `${(initialDiscs.length + 1) * discHeight}px` }}>
			<>
				<div className="rod"></div>
				{children}
			</>
		</button>
	)
}

function Disc({ id, color, position, active }: DiscProps) {
	const maxDiscs: number = initialDiscs.length
	return (
		<div className="disc" style={{ backgroundColor: color, width: `${(maxDiscs - id) * (200 / maxDiscs)}px`, bottom: `${discHeight * position}px` }}></div>
	)
}