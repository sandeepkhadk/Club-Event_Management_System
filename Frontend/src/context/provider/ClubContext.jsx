import { createContext, useContext, useState } from "react";

const ClubContext = createContext(null);

export const ClubProvider = ({ children }) => {
  const [clubs, setClubs] = useState([]);
  const [activeClub, setActiveClub] = useState(null);

  const setClubList = (data) => setClubs(data);
  const selectClub = (club) => setActiveClub(club);

  return (
    <ClubContext.Provider
      value={{
        clubs,
        activeClub,
        setClubList,
        selectClub,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClubContext = () => useContext(ClubContext);
