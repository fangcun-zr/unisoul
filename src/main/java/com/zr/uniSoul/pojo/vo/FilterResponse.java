package com.zr.uniSoul.pojo.vo;

public class FilterResponse {
    private String filteredPsychologyContent;

    public FilterResponse(String filteredPsychologyContent) {
        this.filteredPsychologyContent = filteredPsychologyContent;
    }

    // Getter and Setter
    public String getFilteredPsychologyContent() {
        return filteredPsychologyContent;
    }

    public void setFilteredPsychologyContent(String filteredPsychologyContent) {
        this.filteredPsychologyContent = filteredPsychologyContent;
    }
}
