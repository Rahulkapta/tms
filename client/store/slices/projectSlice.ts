// store/slices/projectSlice.ts
import { ApiProject } from "@/app/project";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  selectedProject: ApiProject | null;
}

const initialState: ProjectState = {
  selectedProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject(state, action: PayloadAction<ApiProject>) {
      state.selectedProject = action.payload;
    },
    clearSelectedProject(state) {
      state.selectedProject = null;
    },
  },
});

export const { setSelectedProject, clearSelectedProject } = projectSlice.actions;

export default projectSlice.reducer;
