import { useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //FETCHING & SEARCHING NOTES
  const [debounseInputValue] = useDebounce(inputValue, 500);

  const notes = useQuery({
    queryKey: ["notes", debounseInputValue, currentPage],
    queryFn: () => fetchNotes(debounseInputValue, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = notes.data?.totalPages ?? 0;

  const handleSearchChange = (newSearch: string) => {
    setInputValue(newSearch);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      {/* -------LOADER--------- */}

      {notes.isLoading && <Loader />}

      {/* -------HEADER ELEMENTS--------- */}

      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />
        {totalPages > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {/* -------NOTELIST--------- */}

      <NoteList notes={notes.data?.notes ?? []} />
      {notes.isError && <ErrorMessage />}

      {/* -------NOTE MODAL--------- */}

      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          children={<NoteForm onClose={() => setIsModalOpen(false)} />}
        />
      )}
    </div>
  );
}