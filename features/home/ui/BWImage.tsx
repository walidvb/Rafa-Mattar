import styled from "styled-components";

export const BWImage = styled.div`
  filter: grayscale(1);
  transition: filter 0.3s ease-in-out;
  &:hover{
    transition: filter 0.5s 0.2s ease-in-out;
    filter: grayscale(0);
  }
`;
