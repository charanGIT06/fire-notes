import Note from "./Note";
import '../scss/notes.scss'
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import NotesState from "../context/NotesContext";
import { ScaleFade, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

const NotesContainer = ({ notes, searchText, setModalData, onOpen, from }) => { // eslint-disable-line no-unused-vars
	NotesContainer.propTypes = {
		notes: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string,
			title: PropTypes.string,
			content: PropTypes.string,
			tags: PropTypes.arrayOf(PropTypes.string),
		})),
		searchText: PropTypes.string,
		setModalData: PropTypes.func,
		onOpen: PropTypes.func,
		from: PropTypes.string
	};

	const navigate = useNavigate();
	const { setPresentNote } = NotesState()
	const { isOpen, onToggle } = useDisclosure()

	useEffect(() => {
			onToggle()
	}, [])

	return (
		<div className="pb-3 container px-4 w-100">
			<div className="row d-flex flex-row">
				{
					notes.filter((note) => {
						if (note?.title?.toLowerCase()?.includes(searchText?.toLowerCase()) || note?.content?.toLowerCase()?.includes(searchText.toLowerCase())) {
							return note
						}
						return null
					}).map((note) => {
						return (
							<div
								className="col-6 col-md-4 col-lg-3 p-2"
								key={note.id}
								onClick={() => {
									// setModalData(note)
									// onOpen()
									setPresentNote(note)
									navigate(`/pnote/${from}`)
								}}
							>
								<ScaleFade initialScale={0.8} in={isOpen}>
									<Note note={note} />
								</ScaleFade>
							</div>
						);
					})
				}
			</div>
		</div>
	)
}

export default NotesContainer;