import React from "react"
import { Pagination } from "react-bootstrap";

interface Props {
  currentPage: number;
  pageCount: number;
  onPageClick: (page: number) => void;
  size?: 'sm' | 'lg';
}

export default ({currentPage, pageCount, onPageClick, size = 'sm'}: Props) => (
  <Pagination>
    <Pagination.Prev onClick={() => onPageClick(currentPage - 1)} disabled={currentPage === 1}/>
    {Array.from({length: pageCount}).map((_, index) => index + 1).map(page => (
      <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageClick(page)} size={size}>
        {page}
      </Pagination.Item>
    ))}
    <Pagination.Next onClick={() => onPageClick(currentPage + 1)} disabled={currentPage === pageCount}/>
  </Pagination>
)