import PropTypes from "prop-types";
import { Card, CardBody, CardFooter, CardHeader, Heading, Text } from "@chakra-ui/react"
import ThemeState from "../context/ThemeContext";

const Note = ({ note }) => {
	Note.propTypes = {
		note: PropTypes.object.isRequired,
	};
	const { theme } = ThemeState()

	return (
		<div className='notecard'>
			<Card size="md" style={theme === 'dark' ? {
				border: '1px solid #e2e8f0',
			} : {}} className={`notecard ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
				<CardHeader className="ncard-header pt-3 pb-1">
					<Heading size="md" noOfLines={1}>{note.title}</Heading>
				</CardHeader>
				<CardBody className="ncard-body mb-2 py-0">
					<Text noOfLines={6} className="content p-0 m-0">
						{note.content}
					</Text>
				</CardBody>
				<CardFooter className="ncard-footer py-0 d-flex flex-row align-items-center">
				</CardFooter>
			</Card>
		</div>
	)
}

export default Note;