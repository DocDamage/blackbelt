/**
 * Tests for ProcessMapping Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProcessMapping } from './ProcessMapping';

describe('ProcessMapping', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock URL.createObjectURL and URL.revokeObjectURL
        global.URL.createObjectURL = vi.fn(() => 'blob:test');
        global.URL.revokeObjectURL = vi.fn();
    });

    describe('Rendering', () => {
        it('renders process mapping tool', () => {
            render(<ProcessMapping />);
            expect(screen.getByText('Process Mapping Tool')).toBeInTheDocument();
        });

        it('renders description text', () => {
            render(<ProcessMapping />);
            expect(screen.getByText(/create sipoc diagrams/i)).toBeInTheDocument();
        });

        it('renders diagram type selector buttons', () => {
            render(<ProcessMapping />);
            expect(screen.getByText('📊 SIPOC')).toBeInTheDocument();
            expect(screen.getByText('🔄 Value Stream')).toBeInTheDocument();
            expect(screen.getByText('🐟 Fishbone')).toBeInTheDocument();
        });

        it('shows SIPOC diagram by default', () => {
            render(<ProcessMapping />);
            expect(screen.getByText('SIPOC Diagram')).toBeInTheDocument();
        });

        it('renders export button', () => {
            render(<ProcessMapping />);
            expect(screen.getByText('📥 Export to CSV')).toBeInTheDocument();
        });
    });

    describe('Diagram Type Switching', () => {
        it('switches to Value Stream when button clicked', () => {
            render(<ProcessMapping />);
            const valueStreamBtn = screen.getByText('🔄 Value Stream');
            
            fireEvent.click(valueStreamBtn);
            
            expect(screen.getByText('Value Stream Map')).toBeInTheDocument();
            expect(valueStreamBtn).toHaveClass('active');
        });

        it('switches to Fishbone when button clicked', () => {
            render(<ProcessMapping />);
            const fishboneBtn = screen.getByText('🐟 Fishbone');
            
            fireEvent.click(fishboneBtn);
            
            expect(screen.getByText('Fishbone (Ishikawa) Diagram')).toBeInTheDocument();
            expect(fishboneBtn).toHaveClass('active');
        });

        it('switches back to SIPOC when button clicked', () => {
            render(<ProcessMapping />);
            
            // First switch to Value Stream
            fireEvent.click(screen.getByText('🔄 Value Stream'));
            expect(screen.queryByText('SIPOC Diagram')).not.toBeInTheDocument();
            
            // Switch back to SIPOC
            const sipocBtn = screen.getByText('📊 SIPOC');
            fireEvent.click(sipocBtn);
            
            expect(screen.getByText('SIPOC Diagram')).toBeInTheDocument();
            expect(sipocBtn).toHaveClass('active');
        });
    });

    describe('SIPOC Diagram', () => {
        it('renders SIPOC table headers', () => {
            render(<ProcessMapping />);
            expect(screen.getByText('Supplier')).toBeInTheDocument();
            expect(screen.getByText('Input')).toBeInTheDocument();
            expect(screen.getByText('Process')).toBeInTheDocument();
            expect(screen.getByText('Output')).toBeInTheDocument();
            expect(screen.getByText('Customer')).toBeInTheDocument();
        });

        it('renders one SIPOC row by default', () => {
            render(<ProcessMapping />);
            const removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(1);
        });

        it('adds new row when add button clicked', () => {
            render(<ProcessMapping />);
            const addButton = screen.getByText('+ Add Row');
            
            fireEvent.click(addButton);
            
            const removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(2);
        });

        it('removes row when remove button clicked', () => {
            render(<ProcessMapping />);
            
            // Add a row first
            fireEvent.click(screen.getByText('+ Add Row'));
            let removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(2);
            
            // Remove the row
            fireEvent.click(removeButtons[0]!);
            removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(1);
        });

        it('disables remove button when only one row remains', () => {
            render(<ProcessMapping />);
            const removeButton = document.querySelector('.remove-row-btn');
            expect(removeButton).toBeDisabled();
        });

        it('updates row input values', () => {
            render(<ProcessMapping />);
            const inputs = document.querySelectorAll('.sipoc-table input');
            
            fireEvent.change(inputs[0]!, { target: { value: 'Test Supplier' } });
            
            expect(inputs[0]).toHaveValue('Test Supplier');
        });
    });

    describe('Value Stream Map', () => {
        beforeEach(() => {
            render(<ProcessMapping />);
            fireEvent.click(screen.getByText('🔄 Value Stream'));
        });

        it('renders value stream metrics', () => {
            expect(screen.getByText('Total Lead Time')).toBeInTheDocument();
            expect(screen.getByText('Value Added Time')).toBeInTheDocument();
            expect(screen.getByText('Process Efficiency')).toBeInTheDocument();
        });

        it('shows default metrics values', () => {
            // Default metrics should show 0 values in the metric cards
            const metricValues = document.querySelectorAll('.metric-value');
            expect(metricValues.length).toBe(3); // Total Lead Time, Value Added Time, Process Efficiency
        });

        it('renders one step by default', () => {
            const stepNumbers = document.querySelectorAll('.step-number');
            expect(stepNumbers.length).toBe(1);
            expect(stepNumbers[0]!).toHaveTextContent('1');
        });

        it('adds new step when add button clicked', () => {
            fireEvent.click(screen.getByText('+ Add Step'));
            
            const stepNumbers = document.querySelectorAll('.step-number');
            expect(stepNumbers.length).toBe(2);
        });

        it('updates step name', () => {
            const nameInput = document.querySelector('.step-name-input');
            fireEvent.change(nameInput!, { target: { value: 'Assembly' } });
            
            expect(nameInput).toHaveValue('Assembly');
        });

        it('updates lead time and recalculates metrics', () => {
            const leadTimeInputs = document.querySelectorAll('input[type="number"]');
            fireEvent.change(leadTimeInputs[0]!, { target: { value: '30' } });
            
            expect(screen.getByText('30 min')).toBeInTheDocument();
        });

        it('changes step type via select', () => {
            const select = document.querySelector('select');
            fireEvent.change(select!, { target: { value: 'inventory' } });
            
            expect(select).toHaveValue('inventory');
        });

        it('updates notes textarea', () => {
            const textarea = document.querySelector('.step-notes');
            fireEvent.change(textarea!, { target: { value: 'Important notes' } });
            
            expect(textarea).toHaveValue('Important notes');
        });
    });

    describe('Fishbone Diagram', () => {
        beforeEach(() => {
            render(<ProcessMapping />);
            fireEvent.click(screen.getByText('🐟 Fishbone'));
        });

        it('renders problem statement input', () => {
            expect(screen.getByPlaceholderText(/what problem are you trying to solve/i)).toBeInTheDocument();
        });

        it('renders default 6M categories', () => {
            const categoryInputs = document.querySelectorAll('.category-name-input');
            expect(categoryInputs.length).toBe(6);
            
            expect(categoryInputs[0]!).toHaveValue('Manpower');
            expect(categoryInputs[1]!).toHaveValue('Methods');
            expect(categoryInputs[2]!).toHaveValue('Machines');
            expect(categoryInputs[3]!).toHaveValue('Materials');
            expect(categoryInputs[4]!).toHaveValue('Measurement');
            expect(categoryInputs[5]!).toHaveValue('Environment');
        });

        it('updates problem statement', () => {
            const problemInput = screen.getByPlaceholderText(/what problem are you trying to solve/i);
            fireEvent.change(problemInput, { target: { value: 'High defect rate' } });
            
            expect(problemInput).toHaveValue('High defect rate');
        });

        it('updates category name', () => {
            const categoryInputs = document.querySelectorAll('.category-name-input');
            fireEvent.change(categoryInputs[0]!, { target: { value: 'People' } });
            
            expect(categoryInputs[0]).toHaveValue('People');
        });

        it('adds cause to category', () => {
            const causeInputs = document.querySelectorAll('.add-cause-input input');
            fireEvent.change(causeInputs[0]!, { target: { value: 'Lack of training' } });
            
            const addButtons = document.querySelectorAll('.add-cause-input button');
            fireEvent.click(addButtons[0]!);
            
            expect(screen.getByText('Lack of training')).toBeInTheDocument();
        });

        it('does not add empty cause', () => {
            const addButtons = document.querySelectorAll('.add-cause-input button');
            expect(addButtons[0]!).toBeDisabled();
        });

        it('adds cause on Enter key press', () => {
            const causeInputs = document.querySelectorAll('.add-cause-input input');
            fireEvent.change(causeInputs[0]!, { target: { value: 'Old equipment' } });
            fireEvent.keyPress(causeInputs[0]!, { key: 'Enter', charCode: 13 });
            
            expect(screen.getByText('Old equipment')).toBeInTheDocument();
        });

        it('removes cause when remove button clicked', () => {
            // Add a cause first
            const causeInputs = document.querySelectorAll('.add-cause-input input');
            fireEvent.change(causeInputs[0]!, { target: { value: 'Cause to remove' } });
            const addButtons = document.querySelectorAll('.add-cause-input button');
            fireEvent.click(addButtons[0]!);
            
            expect(screen.getByText('Cause to remove')).toBeInTheDocument();
            
            // Remove the cause
            const removeCauseBtn = document.querySelector('.cause-item button');
            fireEvent.click(removeCauseBtn!);
            
            expect(screen.queryByText('Cause to remove')).not.toBeInTheDocument();
        });
    });

    describe('Export Functionality', () => {
        it('triggers CSV download for SIPOC', () => {
            const createElementSpy = vi.spyOn(document, 'createElement');
            render(<ProcessMapping />);
            
            const exportBtn = screen.getByText('📥 Export to CSV');
            fireEvent.click(exportBtn);
            
            expect(createElementSpy).toHaveBeenCalledWith('a');
            createElementSpy.mockRestore();
        });

        it('triggers CSV download for Value Stream', () => {
            render(<ProcessMapping />);
            fireEvent.click(screen.getByText('🔄 Value Stream'));
            
            const createElementSpy = vi.spyOn(document, 'createElement');
            const exportBtn = screen.getByText('📥 Export to CSV');
            fireEvent.click(exportBtn);
            
            expect(createElementSpy).toHaveBeenCalledWith('a');
            createElementSpy.mockRestore();
        });

        it('triggers text download for Fishbone', () => {
            render(<ProcessMapping />);
            fireEvent.click(screen.getByText('🐟 Fishbone'));
            
            const createElementSpy = vi.spyOn(document, 'createElement');
            const exportBtn = screen.getByText('📥 Export to CSV');
            fireEvent.click(exportBtn);
            
            expect(createElementSpy).toHaveBeenCalledWith('a');
            createElementSpy.mockRestore();
        });
    });

    describe('Edge Cases', () => {
        it('handles multiple row additions and removals', () => {
            render(<ProcessMapping />);
            const addButton = screen.getByText('+ Add Row');
            
            // Add multiple rows
            fireEvent.click(addButton);
            fireEvent.click(addButton);
            fireEvent.click(addButton);
            
            let removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(4);
            
            // Remove middle row
            fireEvent.click(removeButtons[1]!);
            removeButtons = document.querySelectorAll('.remove-row-btn');
            expect(removeButtons.length).toBe(3);
        });

        it('maintains separate state for each diagram type', () => {
            render(<ProcessMapping />);
            
            // Add data to SIPOC
            const sipocInputs = document.querySelectorAll('.sipoc-table input');
            fireEvent.change(sipocInputs[0]!, { target: { value: 'SIPOC Data' } });
            
            // Switch to Value Stream and add data
            fireEvent.click(screen.getByText('🔄 Value Stream'));
            const nameInput = document.querySelector('.step-name-input');
            fireEvent.change(nameInput!, { target: { value: 'Value Stream Data' } });
            
            // Switch back to SIPOC
            fireEvent.click(screen.getByText('📊 SIPOC'));
            expect(sipocInputs[0]).toHaveValue('SIPOC Data');
        });
    });
});
