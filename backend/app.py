import streamlit as st
import time
from graph.workflow import define_graph
from core.config import Config

st.set_page_config(page_title="The Neural Nexus", layout="wide")

st.title("🧠 The Neural Nexus: Autonomous AI News")

# Sidebar for Config/Status
with st.sidebar:
    st.header("Configuration")
    topic = st.text_input("News Topic", "Latest LLM Benchmarks")
    st.info(f"Model: {Config.MODEL_NAME}")
    
    run_btn = st.button("🚀 Data Pipeline")

# Main Area
col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Agent Live Logs")
    log_container = st.empty()
    
with col2:
    st.subheader("Final Blog Post")
    result_container = st.empty()

if run_btn:
    try:
        Config.validate()
        graph = define_graph()
        
        initial_state = {
            "topic": topic, 
            "news_items": [], 
            "logs": ["Starting Agentic Workflow..."]
        }
        
        # Run graph
        # Since Streamlit needs updates, we can iterate over the stream if we want incremental updates
        # But for prototype, `invoke` + state inspection is easiest, or `stream` if we want real-time logs.
        
        full_logs = []
        
        for event in graph.stream(initial_state):
            # event is a dict of {node_name: state_update}
            for node, values in event.items():
                new_logs = values.get("logs", [])
                full_logs.extend(new_logs)
                
                # Display Logs as Chat
                with log_container.container():
                     # Only show new logs to avoid duplication if re-rendering (basic logic)
                     # Streamlit reruns script on interaction, but graph.stream runs in a loop inside one run.
                     # We just dump the logs found in the event.
                     for log_msg in new_logs:
                         # Attempt to parse "Agent: Message" format for better UI
                         if ": " in log_msg:
                             agent_name, msg = log_msg.split(": ", 1)
                             with st.chat_message(name=agent_name.lower(), avatar="🤖"):
                                 st.write(f"**{agent_name}**: {msg}")
                         else:
                             st.write(f"➜ {log_msg}")

                # If we have draft content, show preview
                if "draft_content" in values:
                    st.session_state["final_content"] = values["draft_content"]
                    result_container.markdown(values["draft_content"])

        if "final_content" in st.session_state:
            result_container.markdown(st.session_state["final_content"])
            st.success("Workflow Complete!")
        
    except Exception as e:
        st.error(f"Error: {str(e)}")
