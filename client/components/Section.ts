import styled from "@emotion/styled";
import SectionHeader from "./SectionHeader";

export default styled.div`
  > *:not(:last-child) {
    margin-bottom: 12px;
  }

  ${SectionHeader} {
    margin-bottom: 24px;
  }
`;
