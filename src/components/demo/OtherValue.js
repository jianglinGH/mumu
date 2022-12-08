import { counterStore as cs } from "./CounterStore";

function OtherValue() {
    return(<span>{cs.count}</span>)
}

export default OtherValue;